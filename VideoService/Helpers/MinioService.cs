using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using VideoService.Interfaces;
using VideoService.Models;

namespace VideoService.Helpers
{
    public class MinioService : IS3StorageService 
    {
        private readonly IMinioClient _client;
        private readonly MinIOSettings _cfg;

        public MinioService(IOptions<MinIOSettings> cfg)
        {
            _cfg = cfg.Value;
            _client = new MinioClient().WithEndpoint(_cfg.Endpoint)
                                       .WithCredentials(_cfg.AccessKey, _cfg.SecretKey)
                                       .WithSSL(false)
                                       .Build();
        }

        public async Task UploadDirectoryAsync(string prefix, string directoryPath)
        {
            await EnsureBucketExists();

            foreach (var file in Directory.GetFiles(directoryPath))
            {
                await using var fs = File.OpenRead(file);

                await _client.PutObjectAsync(
                    new PutObjectArgs()
                        .WithBucket(_cfg.BucketName)
                        .WithObject($"{prefix}/{Path.GetFileName(file)}")
                        .WithStreamData(fs)
                        .WithObjectSize(fs.Length)
                        .WithContentType(GetContentType(file))
                );
            }

            // Сделать все загруженные сегменты публичными
            await MakeAllSegmentsPublic();
        }

        private async Task MakeAllSegmentsPublic()
        {
            // Политика для всех объектов бакета videos
            string policyJson = $@"{{
                            ""Version"": ""2012-10-17"",
                            ""Statement"": [
                                {{
                                    ""Effect"": ""Allow"",
                                    ""Principal"": ""*"",
                                    ""Action"": ""s3:GetObject"",
                                    ""Resource"": ""arn:aws:s3:::{_cfg.BucketName}/*""
                                }}
                            ]
                        }}";

            await _client.SetPolicyAsync(new SetPolicyArgs()
                .WithBucket(_cfg.BucketName)
                .WithPolicy(policyJson)
            );
        }



        public async Task<string> GetPresignedUrlAsync(string objectName, int expirySeconds)
        {
            return await _client.PresignedGetObjectAsync(
                new PresignedGetObjectArgs()
                    .WithBucket(_cfg.BucketName)
                    .WithObject(objectName)
                    .WithExpiry(expirySeconds)
            );
        }

        private async Task EnsureBucketExists()
        {
            if (!await _client.BucketExistsAsync(
                    new BucketExistsArgs().WithBucket(_cfg.BucketName)))
            {
                await _client.MakeBucketAsync(
                    new MakeBucketArgs().WithBucket(_cfg.BucketName));
            }
        }

        private static string GetContentType(string path) =>
            Path.GetExtension(path).ToLowerInvariant() switch
            {
                ".ts" => "video/MP2T",
                ".m3u8" => "application/vnd.apple.mpegurl",
                _ => "application/octet-stream"
            };
    }

}
