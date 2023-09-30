namespace ImageCompressor.API.Results;

public interface IResult
{
    bool IsSuccess { get; }
    string Message { get; }
}
