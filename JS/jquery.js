$(document).ready(function() {
    console.log('jQuery cargado y funcionando');
    
    // ANIMACIONES EN MENU
    if (window.location.pathname.includes('menu.html')) {
        $('.row .col-12').hide().each(function(index) {
            $(this).delay(200 * index).fadeIn(600);
        });
    }
    
    // EFECTOS EN INPUTS
    $('.form-control, .form-select').focus(function() {
        $(this).addClass('border-primary shadow-sm');
    }).blur(function() {
        $(this).removeClass('border-primary shadow-sm');
    });
    
    // AUTOCOMPLETAR EN SENDMONEY
    if ($('#nuevoContacto').length) {
        const contactosDisponibles = [
            "Tony Stark",
            "Bruce Banner",
            "Steve Rogers"
        ];
        
        $('#nuevoContacto').after('<ul id="sugerencias" class="list-group position-absolute w-100" style="z-index: 1000; display: none;"></ul>');
        
        $('#nuevoContacto').on('input', function() {
            const valor = $(this).val().toLowerCase();
            const sugerencias = $('#sugerencias');
            
            if (valor.length > 0) {
                const coincidencias = contactosDisponibles.filter(function(contacto) {
                    return contacto.toLowerCase().includes(valor);
                });
                
                if (coincidencias.length > 0) {
                    sugerencias.empty().show();
                    
                    coincidencias.forEach(function(contacto) {
                        const item = $('<li class="list-group-item list-group-item-action"></li>')
                            .text(contacto)
                            .css('cursor', 'pointer')
                            .click(function() {
                                $('#nuevoContacto').val(contacto);
                                sugerencias.hide();
                            });
                        sugerencias.append(item);
                    });
                } else {
                    sugerencias.hide();
                }
            } else {
                sugerencias.hide();
            }
        });
        
        $(document).click(function(e) {
            if (!$(e.target).closest('#nuevoContacto, #sugerencias').length) {
                $('#sugerencias').hide();
            }
        });
    }
    
    // ANIMACIONES DE TARJETAS
    $('.card').each(function(index) {
        $(this).css('opacity', '0').delay(100 * index).animate({
            opacity: 1
        }, 600);
    });
    
    // HOVER EN BOTONES
    $('.btn').hover(
        function() {
            $(this).addClass('shadow-lg');
        },
        function() {
            $(this).removeClass('shadow-lg');
        }
    );
});