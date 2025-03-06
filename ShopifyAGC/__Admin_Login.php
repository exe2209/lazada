<?php
if(isset($_SESSION['dataerror'])){
    echo "<script>alert('".$_SESSION['dataerror']."');</script>";
    unset($_SESSION['dataerror']);
}
?>
<!DOCTYPE html>
<html lang="en">
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<head>
	<title>Admin Login</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="robots" content="noindex,nofollow" />
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <link rel="shortcut icon" href="<?php echo $siteurl; ?>favicon.ico?v=<?php echo rand(0,99); ?>" type="image/x-icon">
    <link rel="icon" href="<?php echo $siteurl; ?>favicon.ico?v=<?php echo rand(0,99); ?>" type="image/x-icon">
    <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #17a2b8;
          height: 100vh;
        }
        #login .container #login-row #login-column #login-box {
          margin-top: 120px;
          max-width: 600px;
          height: 320px;
          border: 1px solid #9C9C9C;
          background-color: #EAEAEA;
        }
        #login .container #login-row #login-column #login-box #login-form {
          padding: 20px;
        }
        #login .container #login-row #login-column #login-box #login-form #register-link {
          margin-top: -85px;
        }        
    </style>
</head>
<body>
    <div id="login">
        <div class="container">
            <div id="login-row" class="row justify-content-center align-items-center">
                <div id="login-column" class="col-md-6">
                    <div id="login-box" class="col-md-12">
                        <form id="login-form" class="form" action="" method="post">
                            <h3 class="text-center text-info">Admin Login</h3>
                            <div class="form-group">
                                <label for="username" class="text-info">Username:</label><br>
                                <input type="text" name="uzername" id="username" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="password" class="text-info">Password:</label><br>
                                <input type="password" name="pazzword" id="password" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <input type="submit" name="login_area" class="btn btn-info btn-md" value="submit">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>