<div id="graph-<?= $args["Type"]; ?>">
    <?php
    if (isset($args["NA"]) && $args["NA"]){
        ?>
        <div class="graph-NA"></div>
        <?php
    }

    if (isset($args["X"]) && $args["X"]){
        ?>
        <div class="graph-x-axis"></div>
        <?php
    }

    if (isset($args["Y"]) && $args["Y"]){
        ?>
        <div class="graph-y-axis"></div>
        <?php
    }
    ?>

    <div class="graph"></div>
</div>