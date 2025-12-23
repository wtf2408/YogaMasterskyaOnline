using System.Diagnostics;
using System.Text;
using VideoService.Models;
using VideoService.Interfaces;

namespace VideoService.Helpers
{
    public class VideoProcessor : IVideoProcessor
    {
        public async Task<HlsResult> ConvertToHlsAsync(
             string inputFilePath,     // путь к уже существующему файлу
             string originalFileName,
             TimeSpan timeout)
        {
            var workDir = Path.Combine(Path.GetTempPath(), "videosvc", Guid.NewGuid().ToString());
            Directory.CreateDirectory(workDir);

            var hlsDir = Path.Combine(workDir, "hls");
            Directory.CreateDirectory(hlsDir);

            var playlistPath = Path.Combine(hlsDir, "index.m3u8");

            var ffArgs =
                $"-y -i \"{inputFilePath}\" " +                    
                "-c:v libx264 -c:a aac -ac 2 -ar 48000 " +
                "-preset veryfast -crf 22 " +
                "-hls_time 6 -hls_list_size 0 " +
                $"-hls_segment_filename \"{Path.Combine(hlsDir, "seg_%03d.ts")}\" " +
                $"\"{playlistPath}\"";

            var result = await RunFfmpeg(ffArgs, timeout);
            if (!result.Success)
                throw new InvalidOperationException($"ffmpeg failed: {result.Stderr}");

            return new HlsResult
            {
                OutputDirectory = hlsDir,
                PlaylistPath = playlistPath,
                KeyPrefix = Path.GetFileNameWithoutExtension(originalFileName)
                    .Replace(' ', '_')
            };
        }

        private async Task<(bool Success, string Stderr)> RunFfmpeg(string args, TimeSpan timeout)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "D:\\Program Files\\ffmpeg-2025-12-10-git-4f947880bd-essentials_build\\bin\\ffmpeg.exe",
                Arguments = args,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var proc = new Process { StartInfo = psi };
            var stderr = new StringBuilder();

            proc.ErrorDataReceived += (_, e) =>
            {
                if (e.Data != null)
                    stderr.AppendLine(e.Data);
            };

            proc.Start();
            proc.BeginErrorReadLine();

            var exited = await Task.Run(() => proc.WaitForExit((int)timeout.TotalMilliseconds));
            if (!exited)
            {
                try { proc.Kill(); } catch { }
                return (false, "timeout");
            }

            return (proc.ExitCode == 0, stderr.ToString());
        }
    }

}
