<?php

function import($input) {

    // Store name
    $name = $input["name"];

    // If args passed
    if (isset($input["args"])) {

        // Store them
        $args = $input["args"];
    }

    // Compute path to module
    $path = getcwd() . "/modules/" . $name . "/" . $name;

    // Import module
    require $path . ".php";
}

?>