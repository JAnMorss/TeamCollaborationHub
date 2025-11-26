namespace TeamHub.SharedKernel.ErrorHandling;

public static class ResultHelper
{
    public static T CreateOrFail<T>(Func<string, Result<T>> factory, string value)
    {
        var result = factory(value);
        if (result.IsFailure)
            throw new InvalidOperationException(result.Error.ToString());

        return result.Value;
    }

    public static T CreateOrFail<T>(Func<int, Result<T>> factory, int value)
    {
        var result = factory(value);
        if (result.IsFailure)
            throw new InvalidOperationException(result.Error.ToString());

        return result.Value;
    }
}