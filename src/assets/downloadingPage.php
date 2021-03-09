<?php
$dateval=time();
$gbauthdate=gmdate('r', $dateval);
$sharedSecret = 'AWp1NnGtjM9GzaicYbin6CjGcOU=';
$sharedSecret = base64_decode($sharedSecret);
$action = 'enterorder';
$ordersource = 'ebookuri';
// $transaction = 'WEB-8888888';//eg:- 1234
$transaction = mt_rand(1000000000,9999999999);
//ACS-XXXX-<your transaction id>. (XXXX is your 4 letter distributor code)
$bookID = 'urn:isbn:1234567-12';

$bookDownloadURL =
                                "action=".urlencode($action).
                                "&ordersource=".urlencode($ordersource).
                                "&orderid=".urlencode($transaction).
                                "&bookid=".urlencode($bookID).
                                "&gbauthdate=".urlencode($gbauthdate).
                                "&dateval=".urlencode($dateval).
                                "&gblver=4";
 $linkURL = 'http://localhost:8081/fulfillment/URLLink.acsm';

        // Digitaly sign the request
$bookDownloadURL = $linkURL."?".$bookDownloadURL."&auth=".hash_hmac("sha1", $bookDownloadURL, $sharedSecret );
echo '<a href="'.$bookDownloadURL.'">download ebook</a>';