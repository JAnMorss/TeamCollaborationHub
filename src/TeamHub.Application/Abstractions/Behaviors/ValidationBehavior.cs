using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.Exceptions;

namespace TeamHub.Application.Behaviors;
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseCommand
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    private readonly ILogger<ValidationBehavior<TRequest, TResponse>> _logger;

    public ValidationBehavior(
        IEnumerable<IValidator<TRequest>> validators, 
        ILogger<ValidationBehavior<TRequest, TResponse>> logger)
    {
        _validators = validators;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationErrors = _validators
            .Select(validator => validator.Validate(context))
            .Where(validationResult => validationResult.Errors.Any())
            .SelectMany(validationResult => validationResult.Errors)
            .Select(validationFailure => new ValidationError(
                validationFailure.PropertyName,
                validationFailure.ErrorMessage
            ))
            .ToList();

        if (validationErrors.Any())
        {
            _logger.LogError("🚨 Validation triggered for {Request}", typeof(TRequest).Name);

            throw new SharedKernel.Exceptions.ValidationException(validationErrors);
        }

        return await next();
    }
}

