using MediatR;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.SharedKernel.Messaging.Query;

public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
