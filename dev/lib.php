<?php

function import($input) {

    // Store name
    $name = $input["name"];

    // If args passed
    if (isset($input["args"])) {

        // Store them
        $args = $input["args"];
    }

    // Import module
    require getcwd() . "/modules/" . $name . "/" . $name . ".php";
}

?>