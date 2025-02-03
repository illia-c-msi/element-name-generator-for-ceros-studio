$(document).ready(() => {
    const getNextStep = (currentStepNum, typeVal, buttonTypeVal) => {
        switch (currentStepNum) {
            case 1:
                return $("[data-step='2']");
            case 2:
                return typeVal === 'l' ? $("[data-step='3-link']") : $("[data-step='3-button']");
            case '3-button':
                return buttonTypeVal === 'd' ? $("[data-step='3-button-downloadable']") : $("[data-step='4']");
            case '3-link':
            case '3-button-downloadable':
                return $("[data-step='4']");
            default:
                return null;
        }
    };

    const getPreviousStep = (currentStepNum) => {
        switch (currentStepNum) {
            case '3-link':
            case '3-button':
                return $("[data-step='2']");
            case '3-button-downloadable':
            case 4:
                const typeVal = $("[name='type']:checked").val();
                return typeVal === 'b' ? $("[data-step='3-button']") : $("[data-step='3-link']");
            case 2:
                return $("[data-step='1']");
            default:
                return null;
        }
    };

    const buildResultString = () => {
        try {
            const location = $("[name='location']:checked").val();
            const type = $("[name='type']:checked").val();
            const label = $('#label').val();

            if (!location || !type || !label) {
                throw new Error('Missing required fields.');
            }

            let result = `${location},${type}`;

            if (type === 'l') {
                const linkType = $("[name='link-type']:checked").val();
                if (!linkType) throw new Error('Link type not selected.');
                result += `,${linkType}`;
            } else if (type === 'b') {
                const buttonType = $("[name='button-type']:checked").val();
                if (!buttonType) throw new Error('Button type not selected.');
                result += `,${buttonType}`;
                if (buttonType === 'd') {
                    const downloadableType = $("[name='downloadable-type']:checked").val();
                    if (!downloadableType) throw new Error('Downloadable type not selected.');
                    result += `,${downloadableType}`;
                }
            }

            result += `,${label.toLowerCase().trim()}`;
            return result;
        } catch (error) {
            console.error('Error building result string:', error.message);
            alert('Please fill in all required fields.');
            return null;
        }
    };

    $('#multi-step-form').on('click', '.next-step', function () {
        const currentStep = $(this).closest('.step');
        const currentStepNum = currentStep.data('step');
        const typeVal = $("[name='type']:checked").val();
        const buttonTypeVal = $("[name='button-type']:checked").val();

        let isValid = true;

        switch (currentStepNum) {
            case 1:
                if (!$("[name='location']:checked").val()) {
                    alert('Please select an Element Location.');
                    isValid = false;
                }
                break;
            case 2:
                if (!$("[name='type']:checked").val()) {
                    alert('Please select an Element Type.');
                    isValid = false;
                }
                break;
            case '3-link':
                if (!$("[name='link-type']:checked").val()) {
                    alert('Please select a Link Type.');
                    isValid = false;
                }
                break;
            case '3-button':
                if (!$("[name='button-type']:checked").val()) {
                    alert('Please select a Button Type.');
                    isValid = false;
                }
                break;
            case '3-button-downloadable':
                if (!$("[name='downloadable-type']:checked").val()) {
                    alert('Please select a Downloadable Type.');
                    isValid = false;
                }
                break;
            case 4:
                if (!$('#label').val()) {
                    alert('Please enter a Label.');
                    isValid = false;
                }
                break;
        }

        if (isValid) {
            const nextStep = getNextStep(currentStepNum, typeVal, buttonTypeVal);

            if (nextStep) {
                currentStep.removeClass('active');
                nextStep.addClass('active');
            } else {
                console.error('Invalid step progression.');
            }
        }
    });

    $('#multi-step-form').on('click', '.previous-step', function () {
        const currentStep = $(this).closest('.step');
        const currentStepNum = currentStep.data('step');

        const previousStep = getPreviousStep(currentStepNum);

        if (previousStep) {
            currentStep.removeClass('active');
            previousStep.addClass('active');
        } else {
            console.error('Invalid step progression.');
        }
    });

    $('#submit-form').click(() => {
        const result = buildResultString();

        if (result) {
            $('#result').text(result);
            $("[data-step='4']").removeClass('active');
            $('#result-step').addClass('active');
        }
    });

    $('#copy-button').click(() => {
        navigator.clipboard
            .writeText($('#result').text())
            .then(() => alert('Copied to clipboard!'))
            .catch((err) => {
                console.error('Could not copy text: ', err);
                alert('Could not copy to clipboard. Please try manually selecting and copying.');
            });
    });

    $('#start-over').click(() => {
        $('#multi-step-form')[0].reset();
        $('.step').removeClass('active');
        $("[data-step='1']").addClass('active');
        $('#result').text('');
    });
});
