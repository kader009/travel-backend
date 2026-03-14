import jwt from "jsonwebtoken";
import config from "../app/config";

export const tokenUtils = {
  generateTokens(
    userId: string,
    role: string
  ): { accessToken: string; refreshToken: string } {
    // Access token
    const accessToken = jwt.sign(
      { userId, role },
      config.JWT_ACCESS_SECRET as string,
      { expiresIn: "15min" }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { userId, role },
      config.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  },

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "1h",
    });
  },

  // Verify JWT Token
  verifyRefreshToken(refreshToken: string): { userId: string; role: string } {
    try {
      return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET as string) as {
        userId: string;
        role: string;
      };
    } catch (error) {
      console.log(error);
      throw new Error("Invalid refresh token");
    }
  },
};
