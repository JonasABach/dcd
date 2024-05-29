using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;

    public BlobStorageService(BlobServiceClient blobServiceClient, string containerName)
    {
        _blobServiceClient = blobServiceClient;
        _containerName = containerName;
    }

    public Task<string> GetBlobSasUrlAsync(string blobName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);

        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            BlobName = blobName,
            Resource = "b",
            StartsOn = DateTimeOffset.UtcNow,
            ExpiresOn = DateTimeOffset.UtcNow.AddHours(1),
            Protocol = SasProtocol.Https
        };

        sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Create);

        var sasToken = blobClient.GenerateSasUri(sasBuilder).Query;

        return Task.FromResult($"{blobClient.Uri}?{sasToken}");
    }
    private string GenerateSasTokenForBlob(BlobClient blobClient, BlobSasPermissions permissions)
    {
        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = blobClient.GetParentBlobContainerClient().Name,
            BlobName = blobClient.Name,
            Resource = "b",
            StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
            ExpiresOn = DateTimeOffset.UtcNow.AddHours(1),
            Protocol = SasProtocol.Https
        };
        sasBuilder.SetPermissions(permissions);

        var sasToken = blobClient.GenerateSasUri(sasBuilder).Query;

        return sasToken;
    }
    public async Task<string> UploadImageAsync(byte[] imageBytes, string contentType, string blobName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);

        var sasToken = GenerateSasTokenForBlob(blobClient, permissions: BlobSasPermissions.Write);

        var sasBlobUri = new Uri($"{blobClient.Uri}{sasToken}");
        var sasBlobClient = new BlobClient(sasBlobUri);

        using var stream = new MemoryStream(imageBytes, writable: false);
        await sasBlobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType });

        var imageUrl = blobClient.Uri.ToString();
        Console.WriteLine($"Uploaded image URL: {imageUrl}");

        return imageUrl;
    }
}