<?php
include('setting.php');
include('____engine_dom.php');
include('__func_wildcard_5.php');
include('function_data.php');
ini_set('max_execution_time', 6000); //3000 seconds = 50 minutes

$strcurr = explode('/', $currurl);
$wildsub = preg_replace('/'.$strcurr[2].'(.*)/', '', $currurl);
$ifdomx = $wildsub . $strcurr[2].'/';

$data_admin = mysqli_query($mysqli, "SELECT * FROM $DBsett WHERE id='1'");
$a_row = mysqli_fetch_array($data_admin);
$brands = $a_row['brands'];
$icons = $a_row['icons'];
$link_amp = $a_row['link_amp'];
$url_banner = $a_row['url_banner'];
$header = $a_row['header'];
$footer = $a_row['footer'];
$backlink = $a_row['backlink'];
$permalink = $a_row['permalink'];
$template = $a_row['template'];
$spintax_content = $a_row['spintax'];
$keywords_1 = $a_row['keywords_1'];
$keywords_2 = $a_row['keywords_2'];
$keywords_3 = $a_row['keywords_3'];

$thedate    = date('c',time());

if(preg_match('/sitemap-post\.xml/', $currurl)){
Header("Content-Type: text/xml");

echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

echo '
	<url>
		<loc>'.$siteurl.'</loc>
		<lastmod>'.$thedate.'</lastmod>
		<changefreq>daily</changefreq>
		<priority>1</priority>
	</url>
';

$db_dtz = mysqli_query($mysqli, "SELECT id FROM $DBkey");
$idkeyz = array();
while($datazz = mysqli_fetch_array($db_dtz)){
    $idkeyz[] = $datazz['id'];
}
shuffle($idkeyz);
$wherez = sqli_random('id', $idkeyz, 10000);
$ifidmd5 = array();
$db_keyz = mysqli_query( $mysqli, "SELECT * FROM $DBkey WHERE ".$wherez.";");
while($key_row2 = mysqli_fetch_array($db_keyz)){
    $barmd5 = $key_row2['idmd5'];
    $barttl = $key_row2['keywords'];
    $baridz = $key_row2['id'];
    $barwlc = $key_row2['slug'];
    $brnd = trim(preg_replace('/\s{1,}/', ' ', strtolower(seotext(htmlspecialchars_decode(trim($barttl))))));
    $brnd = str_replace(" ", "-", $brnd);
    
    $modeurlx = $siteurl . urlencode(permalink_url($barmd5, $barttl, $baridz, $permalink));

    echo '
    	<url>
    		<loc>'.$modeurlx.'</loc>
    		<lastmod>'.$thedate.'</lastmod>
    		<changefreq>daily</changefreq>
    		<priority>0.85</priority>
    	</url>
    ';
    
}

echo '</urlset>';

}elseif(preg_match('/sitemap-post\.txt/', $currurl)){
    
    
    Header("Content-Type: text/plain; charset=utf-8");
    //header('Content-Type: text/plain; charset=utf-8');
    
$db_dtz = mysqli_query($mysqli, "SELECT id FROM $DBkey");
$idkeyz = array();
while($datazz = mysqli_fetch_array($db_dtz)){
    $idkeyz[] = $datazz['id'];
}
shuffle($idkeyz);
$wherez = sqli_random('id', $idkeyz, 10000);
$ifidmd5 = array();
$db_keyz = mysqli_query( $mysqli, "SELECT * FROM $DBkey WHERE ".$wherez.";");
while($key_row2 = mysqli_fetch_array($db_keyz)){
    $barmd5 = $key_row2['idmd5'];
    $barttl = $key_row2['keywords'];
    $baridz = $key_row2['id'];
    $barwlc = $key_row2['slug'];
    $brnd = trim(preg_replace('/\s{1,}/', ' ', strtolower(seotext(htmlspecialchars_decode(trim($barttl))))));
    $brnd = str_replace(" ", "-", $brnd);
    
    $modeurlx = $siteurl . urlencode(permalink_url($barmd5, $barttl, $baridz, $permalink));

    echo $modeurlx."\r\n";
    
}
    
}
?>