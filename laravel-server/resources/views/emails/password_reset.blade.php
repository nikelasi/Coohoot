<!DOCTYPE html>
<html>
<head>
    <style>
      .top-spacer {
        height: 1rem;
      }

      .logo {
        height: 30px;
        aspect-ratio: 3 / 0.8;
      }

      .heading {
        margin-block-start: 0;
      }

      .signoff {
        color: #888888;
      }
    </style>
</head>
<body>
  <div class="top-spacer"></div>
  <a href="https://coohoot.nj.sg">
    <img class="logo" src="https://drive.google.com/uc?id=14UwDLjmWE113Ryc3ub6PDhCZy_euU4bU&export=media" />
  </a>
  <h1 class="heading">Hi {{ $username }},</h1>
  <p>You're receiving this email because you recently requested for a password reset. To proceed with it, click on the following link:</p>
  <a href="https://coohoot.nj.sg/password_reset/{{ $token }}">https://coohoot.nj.sg/password_reset/{{ $token }}</a>
  <p>This link will be valid for 10 minutes till <strong>{{ $expires_at }}</strong>.</p>
  <p>If you're having trouble with the link, please contact <a href="mailto:coohoot@nj.sg">Coohoot Support</a>. If you didn't request for a password reset, please disregard this email.</p>
  <br>
  <p class="signoff">- Coohoot (<a href="https://coohoot.nj.sg">coohoot.nj.sg</a>)</p>
</body>
</html>