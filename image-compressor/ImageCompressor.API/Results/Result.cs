using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ImageCompressor.API.Results;

public class Result : IResult
{
    public string Message { get; } = string.Empty;

    public bool IsSuccess { get; }

    public Result(string message, bool success)
    {
        Message = message;
        IsSuccess = success;
    }

    public static IResult Success(string message = "")
    {
        return new Result(message, true);
    }

    public static IResult Success<T>(T data)
    {
        return new Result<T>(data);
    }

    public static IResult Error(string message = "")
    {
        return new Result(message, false);
    }

    public override string ToString() => JsonConvert.SerializeObject(this,
        new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
}

public class Result<T> : IResult
{
    public T Data { get; }
    public bool IsSuccess { get; }
    public string Message { get; }
    public Result(T data, string message = "", bool success = true)
    {
        Data = data;
        IsSuccess = success;
        Message = message;
    }

    public override string ToString() => JsonConvert.SerializeObject(this,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
}