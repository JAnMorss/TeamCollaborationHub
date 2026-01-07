namespace TeamHub.SharedKernel.Application.Helpers;

public class QueryObject
{
    public string? SortBy { get; set; } = null;

    public bool Descending { get; set; } = false;

    private int _page = 1;

    private int _pageSize = 10;

    public int Page
    {
        get => _page;
        set => _page = value > 0 ? value : 1;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > 0 ? value : 10;
    }

}