const searchApi = "http://localhost:9000/api/search/keyword?keyword=";

const descriptionApi = "http://localhost:9000/api/search/parameters?id=";

let htmlFunctionList = '';

$(function() {
    /**
     * Function Executes when user input search keywords on Search Box and Fetch Functionj Lists
     */
    $("#serachInputBox").keyup(function() {
        let searchValue = $("#serachInputBox").val();
        if (
            searchValue != "" &&
            typeof searchValue !== "undefined" &&
            searchValue.length > 1
        ) {
            $("#listBox").hide();
            $(".loader").show();
            const timer = setTimeout(function() {
                $(".backButton").css("visibility", "hidden");
                let tempArrayApi = searchApi + searchValue;
                $.ajax(tempArrayApi, {
                    dataType: "json",
                    success: function(data, status, xhr) {
                        $("#listBox").show();
                        $(".loader").hide();
                        let html = "";
                        if (data.count > 0) {
                            data.data.user.forEach(function(item) {
                                html =
                                    html +
                                    '<li class="list-group-item" searchId=' +
                                    item._id +
                                    '><a class="functionList" functionType =' +
                                    item.type +
                                    " functionId=" +
                                    item._id +
                                    ">" +
                                    item.functionName +
                                    "</a></li>";
                            });
                            htmlFunctionList = html;
                            $("#listBox").html(html);
                        } else {
                            $(".backButton").css("visibility", "hidden");
                            let html =
                                '<li class="list-group-item" searchId="none">No Result Found</li>';
                            htmlFunctionList = html;
                            $("#listBox").html(html);
                        }
                    },
                    error: function(jqXhr, textStatus, errorMessage) {
                        console.log("ajax fails");
                    }
                });
            }, 1000);
        } else {
            $(".backButton").css("visibility", "hidden");
            let html =
                '<li class="list-group-item" searchId="none">No Result Found</li>';
            htmlFunctionList = html;
            $("#listBox").html(html);
        }
    });

    /**
     * Function Executes when user click on function and Fetch Brief description of specific function
     */
    $(document).on("click", "a.functionList", function() {
        let id = $(this).attr("functionId");
        let type = $(this).attr("functionType");
        let tempArrayDetailApi = descriptionApi + id;

        $.ajax(tempArrayDetailApi, {
            dataType: "json",
            success: function(result, status, xhr) {
                let htmlData = createListHtml(result, type);
                $("#listBox").html(htmlData);
                $(".backButton").css("visibility", "visible");
            },
            error: function(jqXhr, textStatus, errorMessage) {
                console.log("ajax fails");
            }
        });
    });

    /**
     * Function copy the content of example div
     */
    $(document).on("click", "button.exampleClipboardButton", function() {
        let text = document.getElementById("exampleClipboard");
        if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
            document.execCommand("Copy");
            $(".exampleClipboardButton").html('Copied...');
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("Copy");
            $(".exampleClipboardButton").html('Copied...');
        }
    });

    /**
     * Function re-render previous searach results on Back Button Click
     */
    $(document).on("click", ".backButton", function() {
        $("#listBox").html(htmlFunctionList);
        $(".backButton").css("visibility", "hidden");
    });

    /**
     * 
     * @param {*} result 
     * @param {*} type 
     * 
     * Function creates HTML Content of brief description of specific function
     */
    function createListHtml(result, type) {
        let htmlData = "";
        htmlData =
            htmlData +
            "<h3>Definition [" +
            type +
            "]</h3>" +
            "<span>" +
            result.data.description[0].definition +
            "</span>" +
            "<h3>Syntax</h3>" +
            "<span>" +
            result.data.description[0].syntax +
            "</span>";
        if (result.data.param.length > 0) {
            htmlData =
                htmlData +
                "<h3>Parameters</h3>" +
                '<table class="table table-bordered">' +
                "<thead>" +
                "<tr>" +
                "<th>Arguments</th>" +
                "<th>Description</th>" +
                "</thead>" +
                "<tbody>";
            result.data.param.forEach(function(element) {
                htmlData =
                    htmlData +
                    "<tr><td>" +
                    element.argument +
                    "</td>" +
                    "<td>" +
                    element.description +
                    "</td></tr>";
            });
        }
        htmlData = htmlData + "</tbody></table>";
        if (result.data.examples.length > 0) {
            htmlData =
                htmlData +
                '<div class="accordion" id="accordionExample">' +
                '<div class="card">' +
                '<div class="card-header" id="headingOne">' +
                '<h2 class="mb-0">' +
                '<button style="font-size:18px;" class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">' +
                "Example" +
                "</button>" +
                "</h2>" +
                "</div>" +
                '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
                '<div class="card-body">';
            htmlData =
                htmlData +
                '<div class="example" id="exampleClipboard">' +
                '<h5 style="font-size:16px;">' +
                result.data.examples[0].example +
                "</div>" +
                "</h5>" +
                "<button class='exampleClipboardButton'><i class='fa fa-clipboard' aria-hidden='true'> Copy</i></button>" +
                "<br/>" +
                "<br/>" +
                '<div class="example">' +
                "<h4><b>Output :-</b></h4>" +
                result.data.examples[0].output +
                "</div>";
            htmlData =
                htmlData + "</div>" + "</div>" + "</div></div>";
        }
        return htmlData;
    }
});