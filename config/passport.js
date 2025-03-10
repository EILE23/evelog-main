const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
require("dotenv").config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user information from the Kakao profile
          const kakaoUser = {
            id: profile.id,
            nickname: profile.username,
            email:
              profile._json &&
              profile._json.kakao_account &&
              profile._json.kakao_account.email,
            profileImage:
              profile._json &&
              profile._json.kakao_account &&
              profile._json.kakao_account.profile &&
              profile._json.kakao_account.profile.profile_image_url,
          };
          console.log("kakaoUser from passport.js", kakaoUser);

          // Here, you would typically check if the user exists in your database
          // and either create a new user or retrieve an existing one.

          // Example:
          //   const existingUser = await User.findOne({
          //     where: { username: kakaoUser.id },
          //   });
          //   if (existingUser) {
          //     done(null, existingUser);
          //   } else {
          //     const newUser = await User.create({
          //       username: kakaoUser.id,
          //       nickname: kakaoUser.nickname,
          //       email: kakaoUser.email,
          //     });
          //     console.log(newUser, "newUser from passport.js/config");
          //     done(null, newUser);
          //   }

          //   For now, just pass the Kakao user object
          done(null, kakaoUser);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
