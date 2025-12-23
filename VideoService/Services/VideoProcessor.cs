using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using System.Text;
using VideoService.Grpc;
using VideoService.Interfaces;
using VideoService.Models;


namespace VideoService.Services;



public class VideoProcessorService : VideoService.Grpc.VideoService.VideoServiceBase
{
    private readonly IVideoProcessor _videoProcessor;
    private readonly IS3StorageService _storage;
    private readonly VideoServiceDbContext _db;
    public VideoProcessorService(IVideoProcessor videoProcessor,
                                 IS3StorageService storage,
                                 VideoServiceDbContext db)
    {
        _videoProcessor = videoProcessor;
        _storage = storage;
        _db = db;
    }

    public override async Task<UploadVideoResponse> UploadVideo(
       IAsyncStreamReader<UploadVideoRequest> requestStream,
       ServerCallContext context)
    {
        string? filename = null;
        var tempFile = Path.GetTempFileName();

        try
        {
            await using (var fs = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await foreach (var message in requestStream.ReadAllAsync())
                {
                    if (filename == null)
                    {
                        filename = message.Filename;
                        if (string.IsNullOrEmpty(filename))
                            throw new RpcException(new Status(StatusCode.InvalidArgument, "Filename is required"));
                    }

                    if (message.ChunkData != null && message.ChunkData.Length > 0)
                        await fs.WriteAsync(message.ChunkData.ToByteArray());
                }
            }

        }
        catch
        {
            File.Delete(tempFile);
            throw;
        }

        // Конвертация в HLS
        var hls = await _videoProcessor.ConvertToHlsAsync(tempFile, filename, TimeSpan.FromMinutes(10));


        // Загрузка на S3
        await _storage.UploadDirectoryAsync(hls.KeyPrefix, hls.OutputDirectory);

        // Генерация VideoId
        var videoId = Guid.NewGuid().ToString();

        // Сохраняем mapping в БД
        var mapping = new VideoMapping
        {
            VideoId = videoId,
            KeyPrefix = hls.KeyPrefix,
            OriginalFileName = filename
        };
        _db.VideoMappings.Add(mapping);
        await _db.SaveChangesAsync();


        // Удаляем временный файл
        File.Delete(tempFile);

        return new UploadVideoResponse { VideoId = videoId };
    }


    public override async Task<BatchGetPlaybackUrlsResponse> BatchGetPlaybackUrls(
    BatchGetPlaybackUrlsRequest request,
    ServerCallContext context)
    {
        var response = new BatchGetPlaybackUrlsResponse();

        // Получаем все маппинги сразу из БД
        var mappings = await _db.VideoMappings
            .Where(vm => request.VideoIds.Contains(vm.VideoId))
            .ToDictionaryAsync(vm => vm.VideoId, vm => vm.KeyPrefix);

        foreach (var videoId in request.VideoIds)
        {
            if (mappings.TryGetValue(videoId, out var keyPrefix))
            {
                var url = await _storage.GetPresignedUrlAsync($"{keyPrefix}/index.m3u8", 3600);
                response.Items.Add(new PlaybackUrl
                {
                    VideoId = videoId,
                    HlsUrl = url
                });
            }
            else
            {
                // Если videoId не найден, можно вернуть пустой URL или проигнорировать
                response.Items.Add(new PlaybackUrl
                {
                    VideoId = videoId,
                    HlsUrl = string.Empty
                });
            }
        }

        return response;
    }


    public override async Task<GetPlaybackUrlResponse> GetPlaybackUrl(GetPlaybackUrlRequest request, ServerCallContext context)
    {
        var mapping = await _db.VideoMappings.FindAsync(request.VideoId);
        if (mapping == null)
            throw new RpcException(new Status(StatusCode.NotFound, "VideoId not found"));

        var url = await _storage.GetPresignedUrlAsync($"{mapping.KeyPrefix}/index.m3u8", 3600);
        return new GetPlaybackUrlResponse { HlsUrl = url };
    }



}

