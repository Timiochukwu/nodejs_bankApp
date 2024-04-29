<?php
$status = [];

// var_dump($userSession);
// die;

try {
  $targetDir = "uploads/";
$fileName = str_replace(" ","_",basename($_FILES['file']['name']));
$targetFilePath = $targetDir . rand(10000,99999).$fileName;
$fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath);

if (file_exists($targetFilePath)) {
  $upload = $econn->prepare("UPDATE employee_user SET image_1=:img WHERE default_hash_id =:hid ");
  $upload->bindParam(":img", $targetFilePath);
  $upload->bindParam(":hid", $userSession);
  $upload->execute();
}
$status['success'] = true;


} catch (Exception $e) {
  $status['failed'] = $e;
}

$result = json_encode($status);
echo $result;

 ?>
