using TeamHub.Domain.Users.Entities;
using TeamHub.Domain.Users.Interface;

namespace TeamHub.Infrastrucure.Repositories;

internal sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) 
        : base(context)
    {
    }
}
