from prolog_engine import verificar_compatibilidad


def test_casos_clave():
    casos = [
        # (donante, receptor, esperado)
        ('O-', 'AB+', True),  # O- es donante universal
        ('AB+', 'O-', False),  # AB+ no puede donar a O-
        ('A+', 'A+', True),  # Idéntico
        ('A-', 'A+', True),  # Rh negativo dona a positivo
        ('A+', 'A-', False),  # Rh positivo NO dona a negativo
        ('B+', 'AB+', True),  # B+ dona a AB+
        ('AB-', 'AB+', True),  # AB- dona a AB+ (solo Rh)
        ('O+', 'B-', False),  # O+ no puede donar a B- (Rh+ a Rh-)
    ]

    for donante, receptor, esperado in casos:
        compatible, mensaje = verificar_compatibilidad(donante, receptor)
        estado = "✅ PASA" if compatible == esperado else "❌ FALLA"
        print(f"{estado} | Donante: {donante} → Receptor: {receptor} | Esperado: {esperado} | Obtenido: {compatible}")
        print(f"     Mensaje: {mensaje}\n")


if __name__ == "__main__":
    test_casos_clave()