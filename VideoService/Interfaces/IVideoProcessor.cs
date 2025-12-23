using VideoService.Models;

namespace VideoService.Interfaces
{
    public interface IVideoProcessor
    {
        Task<HlsResult> ConvertToHlsAsync(string filePath, string originalFileName, TimeSpan timeout);
    }

}
