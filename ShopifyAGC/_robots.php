<?php
Header("Content-Type: text/plain");
ini_set('max_execution_time', 6000); //3000 seconds = 50 minutes
include('setting.php');
$strcurr = explode('/', $currurl);
$wildsub = preg_replace('/'.$strcurr[2].'(.*)/', '', $currurl);
?>
Host: <?php echo $siteurl; ?>

<?php
echo "Sitemap: ".$siteurl."sitemap-post.xml";
?>