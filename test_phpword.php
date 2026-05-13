<?php
require 'vendor/autoload.php';
$tp = new \PhpOffice\PhpWord\TemplateProcessor('storage/app/public/templates/template_bulanan.docx');
var_dump(method_exists($tp, 'setHtml'));
var_dump(method_exists($tp, 'setComplexBlock'));
var_dump(method_exists($tp, 'setComplexValue'));
