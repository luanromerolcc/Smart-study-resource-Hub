from django.db import models


class Resource(models.Model):
    title = models.CharField(max_length=100)
    url = models.URLField()
    TypeChoices = [("pdf", "PDF"), ("video", "Vídeo"), ("link", "Link")]
    type = models.CharField(max_length=10, choices=TypeChoices)
    description = models.TextField(blank=True, default="")
    tags = models.JSONField(default=list)
    creation_date = models.DateTimeField(auto_now_add=True)  # dates added for ordering
    update_date = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = [
            "-creation_date"
        ]  # order by date from most to least recent resource
