namespace TeamHub.SharedKernel.Repositories;

public interface IUserOwned
{
    Guid CreatedById { get; }
}
