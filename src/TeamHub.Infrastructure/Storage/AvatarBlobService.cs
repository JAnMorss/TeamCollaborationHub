using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using TeamHub.SharedKernel.Storage;

namespace TeamHub.Infrastructure.Storage;

internal sealed class AvatarBlobService(BlobServiceClient blobServiceClient) : IAvatarBlobService
{
    private const string ContainerName = "avatars";

    public async Task DeleteAsync(
        Guid fileId, 
        CancellationToken cancellationToken = default)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
        var blobClient = containerClient.GetBlobClient(fileId.ToString());
        await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }

    public async Task<FileResponse> DownloadAsync(
        Guid fileId, 
        CancellationToken cancellationToken = default)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
        var blobClient = containerClient.GetBlobClient(fileId.ToString());
        var response = await blobClient.DownloadContentAsync(cancellationToken: cancellationToken);

        return new FileResponse(
            response.Value.Content.ToStream(),
            response.Value.Details.ContentType ?? "application/octet-stream",
            fileId.ToString());
    }

    public async Task<Guid> UploadAsync(
        Stream stream, 
        string contentType, 
        CancellationToken cancellationToken = default)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: cancellationToken);

        var fileId = Guid.NewGuid();
        var blobClient = containerClient.GetBlobClient(fileId.ToString());

        await blobClient.UploadAsync(
            stream,
            new BlobHttpHeaders { ContentType = contentType },
            cancellationToken: cancellationToken);

        return fileId;
    }
    public string GetBlobUri(Guid fileId)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient("avatars");
        var blobClient = containerClient.GetBlobClient(fileId.ToString());
        return blobClient.Uri.ToString();
    }

}
