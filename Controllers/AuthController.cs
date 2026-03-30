using DevTrack.API.DTOs.Auth;
using DevTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DevTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            var response = await authService.RegisterAsync(request);
            SetRefreshTokenCookie(response);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            var response = await authService.LoginAsync(request);
            SetRefreshTokenCookie(response);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var token = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(token))
        return Unauthorized(new { message = "No refresh token." });

        try
        {
            var response = await authService.RefreshAsync(token);
            SetRefreshTokenCookie(response);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke()
    {
        var token = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(token))
            await authService.RevokeAsync(token);
        
        Response.Cookies.Delete("refreshToken");
        return NoContent();
    }

    private void SetRefreshTokenCookie(AuthResponse response)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);
    }
}
