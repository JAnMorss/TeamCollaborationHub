using MediatR;
using TeamHub.SharedKernel.Domain.ErrorHandling;

namespace TeamHub.SharedKernel.Application.Mediator.Query;

public interface IQueryHandler<TQuery, TResponse> 
    : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse>
{
}