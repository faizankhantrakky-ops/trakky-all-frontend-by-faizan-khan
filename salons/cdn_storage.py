from storages.backends.azure_storage import AzureStorage
import os

class AzureCDNMediaStorage(AzureStorage):
    account_name = os.environ.get("AZURE_ACCOUNT_NAME")
    account_key = os.environ.get("AZURE_ACCOUNT_KEY")
    azure_container = os.environ.get("AZURE_CONTAINER")
    expiration_secs = None

    # ✅ Correct custom domain — it should point to the root of the blob container path in CDN
    custom_domain = "trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics"

    def url(self, name):
        return f"https://{self.custom_domain.rstrip('/')}/{name.lstrip('/')}"
