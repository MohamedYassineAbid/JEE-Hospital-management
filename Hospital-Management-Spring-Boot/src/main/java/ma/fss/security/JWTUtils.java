package ma.fss.security;

public class JWTUtils {
    public static final String SECRET = "mySecret1234";
    public static final String AUTH_HEADER = "Authorization";
    public static final long EXPIRE_ACCESS_TOKEN = 60 * 60 * 1000; // 1 hour
    public static final long EXPIRE_REFRESH_TOKEN = 24 * 60 * 60 * 1000; // 24 hours
    public static final String PREFIX = "Bearer ";
}
