<?php
require 'vendor/autoload.php';
$templates = [
    'template_bulanan.docx',
    'template_hawasbid.docx',
    'template_monev_ptip.docx',
    'template_tindak_lanjut.docx',
];

foreach ($templates as $t) {
    $path = 'storage/app/public/templates/' . $t;
    if (file_exists($path)) {
        echo "Vars in $t:\n";
        $tp = new \PhpOffice\PhpWord\TemplateProcessor($path);
        $vars = $tp->getVariables();
        print_r($vars);
    }
}
