$(function() {
    // Set active page
    $('li#teamresults').addClass("active");

    // Swap results
    
    $('#results-switch').change(function() {
        if (this.checked) {
            //show all results
            $('#section-all-results').removeClass("hidden");
            $('#section-some-results').addClass("hidden")
        } else {
            //show just normal results
            $('#section-all-results').addClass("hidden");
            $('#section-some-results').removeClass("hidden");
           
        }
    });
    
});