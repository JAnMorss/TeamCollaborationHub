using MediatR;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.SharedKernel.Application.Mediator.Query;

public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
