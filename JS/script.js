// ========================================
// VARIABLES GLOBALES
// ========================================

// Cargar saldo desde localStorage o usar el inicial
let saldoActual = parseFloat(localStorage.getItem('saldoActual')) || 5000.00;

// Cargar lista de contactos desde localStorage o usar la inicial
let listaContactos = JSON.parse(localStorage.getItem('listaContactos')) || [
    "Tony Stark",
    "Bruce Banner",
    "Steve Rogers"
];

// Cargar historial desde localStorage o usar el inicial
let historialTransacciones = JSON.parse(localStorage.getItem('historialTransacciones')) || [
    {
        tipo: "deposito",
        monto: 3000.00,
        fecha: "10/01/2026 - 15:30",
        concepto: "Sueldo enero"
    },
    {
        tipo: "envio",
        monto: 1500.00,
        fecha: "09/01/2026 - 18:45",
        destinatario: "Tony Stark",
        concepto: "Préstamo"
    },
    {
        tipo: "deposito",
        monto: 2000.00,
        fecha: "08/01/2026 - 10:20",
        concepto: "Ahorro"
    }
];

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function formatearMoneda(numero) {
    return "$" + numero.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.(\d{2})$/, '.$1');
}

function obtenerFechaActual() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    const hora = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    return dia + '/' + mes + '/' + anio + ' - ' + hora + ':' + minutos;
}

function actualizarSaldo() {
    const elementos = ['saldoDisplay', 'saldoActual', 'saldoDisponible', 'saldoTotal'];
    
    elementos.forEach(function(id) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = formatearMoneda(saldoActual);
        }
    });
}

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('saldoActual', saldoActual.toString());
    localStorage.setItem('listaContactos', JSON.stringify(listaContactos));
    localStorage.setItem('historialTransacciones', JSON.stringify(historialTransacciones));
    console.log('✅ Datos guardados en localStorage');
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Alke Wallet iniciada');
    console.log('Saldo cargado:', formatearMoneda(saldoActual));
    actualizarSaldo();
    
    // LOGIN
    const btnLogin = document.getElementById('btnLogin');
    
    if (btnLogin) {
        console.log('Botón login encontrado');
        btnLogin.addEventListener('click', function() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            console.log('Click en login - Email:', email);
            
            if (email.trim() !== '' && password.trim() !== '') {
                alert('¡Login exitoso!');
                window.location.href = 'menu.html';
            } else {
                alert('Completa todos los campos');
            }
        });
    }
    
    // DEPÓSITO
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        console.log('Deposit form encontrado');
        depositForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const monto = parseFloat(document.getElementById('monto').value);
            const descripcion = document.getElementById('descripcion').value || 'Depósito';
            
            if (monto > 0) {
                // Sumar al saldo
                saldoActual += monto;
                
                // Agregar al historial
                historialTransacciones.unshift({
                    tipo: "deposito",
                    monto: monto,
                    fecha: obtenerFechaActual(),
                    concepto: descripcion
                });
                
                // Guardar en localStorage
                guardarDatos();
                
                // Actualizar vista
                actualizarSaldo();
                
                document.getElementById('mensajeExito').classList.remove('d-none');
                document.getElementById('detalleDeposito').textContent = 
                    'Se depositó ' + formatearMoneda(monto) + ' exitosamente. Nuevo saldo: ' + formatearMoneda(saldoActual);
                
                depositForm.reset();
                
                setTimeout(function() {
                    document.getElementById('mensajeExito').classList.add('d-none');
                }, 5000);
            } else {
                alert('Ingresa un monto válido mayor a 0');
            }
        });
    }
    
    // ENVIAR DINERO
    const sendMoneyForm = document.getElementById('sendMoneyForm');
    if (sendMoneyForm) {
        console.log('Send money form encontrado');
        
        const btnAgregarContacto = document.getElementById('agregarContacto');
        if (btnAgregarContacto) {
            btnAgregarContacto.addEventListener('click', function() {
                const nuevoContacto = document.getElementById('nuevoContacto').value.trim();
                
                if (nuevoContacto) {
                    if (!listaContactos.includes(nuevoContacto)) {
                        listaContactos.push(nuevoContacto);
                        
                        const select = document.getElementById('contacto');
                        const option = document.createElement('option');
                        option.value = nuevoContacto;
                        option.textContent = nuevoContacto;
                        select.appendChild(option);
                        select.value = nuevoContacto;
                        
                        document.getElementById('nuevoContacto').value = '';
                        
                        // Guardar en localStorage
                        guardarDatos();
                        
                        alert('Contacto "' + nuevoContacto + '" agregado');
                    } else {
                        alert('Este contacto ya existe');
                    }
                } else {
                    alert('Ingresa un nombre de contacto');
                }
            });
        }
        
        sendMoneyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const contacto = document.getElementById('contacto').value;
            const monto = parseFloat(document.getElementById('montoEnviar').value);
            const concepto = document.getElementById('concepto').value || 'Transferencia';
            
            if (!contacto) {
                alert('Selecciona un contacto');
                return;
            }
            
            if (monto <= 0) {
                alert('Ingresa un monto válido mayor a 0');
                return;
            }
            
            if (monto > saldoActual) {
                alert('Saldo insuficiente. Tu saldo es ' + formatearMoneda(saldoActual));
                return;
            }
            
            // Restar del saldo
            saldoActual -= monto;
            
            // Agregar al historial
            historialTransacciones.unshift({
                tipo: "envio",
                monto: monto,
                fecha: obtenerFechaActual(),
                destinatario: contacto,
                concepto: concepto
            });
            
            // Guardar en localStorage
            guardarDatos();
            
            // Actualizar vista
            actualizarSaldo();
            
            document.getElementById('mensajeEnvio').classList.remove('d-none');
            document.getElementById('detalleEnvio').textContent = 
                'Transferencia de ' + formatearMoneda(monto) + ' a ' + contacto + ' exitosa. Nuevo saldo: ' + formatearMoneda(saldoActual);
            
            sendMoneyForm.reset();
            
            setTimeout(function() {
                document.getElementById('mensajeEnvio').classList.add('d-none');
            }, 5000);
        });
    }
    
    // TRANSACTIONS - Mostrar historial dinámico
    if (window.location.pathname.includes('transactions.html')) {
        console.log('Cargando historial de transacciones...');
        mostrarHistorial();
    }
});

// ========================================
// FUNCIÓN PARA MOSTRAR HISTORIAL DINÁMICO
// ========================================

function mostrarHistorial() {
    const contenedor = document.querySelector('.card.p-4');
    
    if (!contenedor) return;
    
    // Limpiar transacciones estáticas (las del HTML)
    const transaccionesEstaticas = contenedor.querySelectorAll('.card.mb-3');
    transaccionesEstaticas.forEach(function(t) {
        t.remove();
    });
    
    // Mostrar historial desde localStorage
    if (historialTransacciones.length === 0) {
        document.getElementById('sinTransacciones').classList.remove('d-none');
        return;
    }
    
    historialTransacciones.forEach(function(transaccion) {
        const esDeposito = transaccion.tipo === "deposito";
        const icono = esDeposito ? "💰" : "📤";
        const titulo = esDeposito ? "Depósito" : "Transferencia";
        const colorMonto = esDeposito ? "text-success" : "text-danger";
        const signo = esDeposito ? "+" : "-";
        const montoFormateado = formatearMoneda(transaccion.monto);
        
        let destinatarioHTML = '';
        if (!esDeposito && transaccion.destinatario) {
            destinatarioHTML = '<p class="card-text mb-0"><small>Destinatario: ' + transaccion.destinatario + '</small></p>';
        }
        
        const tarjetaHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title mb-1">${icono} ${titulo}</h5>
                            <p class="card-text text-muted mb-0">
                                <small>${transaccion.fecha}</small>
                            </p>
                            ${destinatarioHTML}
                            <p class="card-text mb-0">
                                <small>Concepto: ${transaccion.concepto}</small>
                            </p>
                        </div>
                        <div class="text-end">
                            <h4 class="${colorMonto} mb-0">${signo} ${montoFormateado}</h4>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.insertAdjacentHTML('beforeend', tarjetaHTML);
    });
}
