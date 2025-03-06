<?php
if(isset($_POST['login_area'], $_POST['uzername'], $_POST['pazzword'])) {
    $datapass = md5($pass_admin);
    $datauser = md5($user_admin);
    $formpass = md5(trim($_POST['pazzword']));
    $formuser = md5(trim($_POST['uzername']));
    if(preg_match('/^'.$formpass.'$/', $datapass) && preg_match('/^'.$formuser.'$/', $datauser)){
        $_SESSION['uzeradmin'] = $datauser;
        $_SESSION['pazzadmin'] = $datapass;
        header("Location: ".$siteurl."admin?data=index");
        exit();
    }else{
        $_SESSION['dataerror'] = 'Ups... User atau Password Salah...';
        header("Location: ".$siteurl."admin/login");
        exit();
    }
}

?>