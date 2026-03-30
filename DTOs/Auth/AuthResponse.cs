namespace DevTrack.API.DTOs.Auth;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonIgnore]
    public string RefreshToken { get; set; } = string.Empty;
}