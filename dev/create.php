<?php

$projectName = readline("projectName: ");
$projectType = readline("projectType: ['theme', 'style]");

switch ($projectType) {
    case "theme":
        createTheme($projectName);
        break;
    case "style":
        createStyle($projectName);
        break;
}
function createTheme($projectName) {
    if (!file_exists($projectName)) mkdir($projectName);
    else die("Project already exists!");

    $basicpath = 'WCbasics';
    /*
    $mods = [
        "../WebApp.class.js" => "../../WebApp.class.js",
        "../devtool.js" => "../../devtool.js",
        "../index.js" => "../../index.js"
    ];

    $tsContent = file_get_contents(__DIR__. "/basics/basicTS.ts");
    array_map(function ($key, $value) use (&$tsContent) {
        $tsContent = str_replace($key, $value, $tsContent);
    }, array_keys($mods), array_values($mods));
    */

    //file_put_contents(__DIR__. '/' .$projectName. "/index.ts", $tsContent);
    copy(__DIR__. "/{$basicpath}/basicTS.ts", __DIR__. '/'. $projectName. "/index.ts");
    copy(__DIR__. "/{$basicpath}/basicCSS.css", __DIR__ . '/' . $projectName. "/index.css");
    copy(__DIR__. "/{$basicpath}/basicHTML.html", __DIR__. '/'. $projectName. "/index.html");
    copy(__DIR__."/{$basicpath}/tsconfig.json", __DIR__. '/'. $projectName. "/tsconfig.json");
    copy(__DIR__."/{$basicpath}/backend", __DIR__. '/' . $projectName . '/backend');
    die("Theme project created");
}
function createStyle($projectName) {
    if (!file_exists($projectName)) mkdir($projectName);
    else die("Project already exists!");
    $cssContent = file_get_contents(__DIR__. "/basicCSS.css");
    file_put_contents(__DIR__. '/'.$projectName. "/index.css", $cssContent);
    die("Style Project Created!");
}
