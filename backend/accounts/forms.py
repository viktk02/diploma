from django import forms
from django.contrib.auth.forms import PasswordChangeForm
from .models import User


class ProfileForm(forms.ModelForm):
    class Meta:
        model  = User
        fields = ["name", "email"]
        widgets = {
            "name":  forms.TextInput(attrs={"class": "vTextField"}),
            "email": forms.EmailInput(attrs={"class": "vTextField"}),
        }


class ChangePasswordForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs["class"] = "vTextField"