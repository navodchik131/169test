export function maxheight(class_name,visibility) {
        var max_height = 0;
        $("." + class_name).removeAttr("style");

        if(visibility){
        $("." + class_name).each(function () {
            var h_block = parseInt($(this).height());
            if (h_block > max_height) {
                max_height = h_block;
            }
        });
        $("." + class_name).height(max_height);
        }
        else {
                $("." + class_name).each(function () {
                    if ($(this).is(':visible')) {
                        var h_block = parseInt($(this).height());
                        if (h_block > max_height) {
                            max_height = h_block;
                        }
                }
                });
                $("." + class_name).height(max_height);

        }
    }


