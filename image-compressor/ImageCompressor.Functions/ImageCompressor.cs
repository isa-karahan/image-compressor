using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.Versioning;

namespace ImageCompressor.Functions;

[SupportedOSPlatform("windows")]
internal static class ImageCompressor
{
    public static Stream Compress(Stream inputImageStream, long qualityLevel)
    {
        using var image = Image.FromStream(inputImageStream);
        var encoderParams = new EncoderParameters(1);
        encoderParams.Param[0] = new EncoderParameter(Encoder.Quality, qualityLevel);

        var jpegCodecInfo = GetEncoderInfo(ImageFormat.Jpeg);

        var outputImageStream = new MemoryStream();
        image.Save(outputImageStream, jpegCodecInfo, encoderParams);

        outputImageStream.Seek(0, SeekOrigin.Begin);

        return outputImageStream;
    }

    private static ImageCodecInfo GetEncoderInfo(ImageFormat format)
    {
        var codecs = ImageCodecInfo.GetImageEncoders();

        foreach (var codec in codecs)
        {
            if (codec.FormatID == format.Guid)
            {
                return codec;
            }
        }

        throw new NotSupportedException("No encoder found for the specified format.");
    }
}
