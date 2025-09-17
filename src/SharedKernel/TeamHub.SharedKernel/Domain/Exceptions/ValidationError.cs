namespace TeamHub.SharedKernel.Domain.Exceptions;

public sealed record ValidationError(
    string PropertyName,
    string ErrorMessage);
