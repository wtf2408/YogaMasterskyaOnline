namespace VideoService.Interfaces
{
    public interface IS3StorageService
    {
        Task UploadDirectoryAsync(string prefix, string directoryPath);
        Task<string> GetPresignedUrlAsync(string objectName, int expirySeconds);
    }
}
