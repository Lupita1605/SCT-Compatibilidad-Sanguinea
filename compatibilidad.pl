% ============================================
% BASE DE HECHOS: ANTÍGENOS Y ANTICUERPOS
% ============================================

% antígenos(TipoSanguíneo, ListaDeAntígenos)
antigenos('A+', [a, rh]).
antigenos('A-', [a]).
antigenos('B+', [b, rh]).
antigenos('B-', [b]).
antigenos('AB+', [a, b, rh]).
antigenos('AB-', [a, b]).
antigenos('O+', [rh]).
antigenos('O-', []).

% anticuerpos(TipoSanguíneo, ListaDeAnticuerpos)
anticuerpos('A+', [anti_b]).
anticuerpos('A-', [anti_b, anti_rh]).
anticuerpos('B+', [anti_a]).
anticuerpos('B-', [anti_a, anti_rh]).
anticuerpos('AB+', []).
anticuerpos('AB-', [anti_rh]).
anticuerpos('O+', [anti_a, anti_b]).
anticuerpos('O-', [anti_a, anti_b, anti_rh]).

% anti_contra(Anticuerpo, Antígeno)
anti_contra(anti_a, a).
anti_contra(anti_b, b).
anti_contra(anti_rh, rh).

% ============================================
% REGLA PRINCIPAL DE COMPATIBILIDAD
% ============================================
% compatible_donante(Donante, Receptor)
compatible_donante(Donante, Receptor) :-
    antigenos(Donante, AntDonante),
    anticuerpos(Receptor, AntiReceptor),
    \+ ( member(Anti, AntiReceptor),
         member(Ant, AntDonante),
         anti_contra(Anti, Ant) ).

% ============================================
% REGLA DE EXPLICACIÓN (PARA SABER POR QUÉ)
% ============================================
% explica(Donante, Receptor, Mensaje)
explica(Donante, Receptor, Mensaje) :-
    antigenos(Donante, AntDonante),
    anticuerpos(Receptor, AntiReceptor),
    member(Anti, AntiReceptor),
    member(Ant, AntDonante),
    anti_contra(Anti, Ant),
    !,
    atomic_list_concat(['Incompatible: El receptor tiene ', Anti, ' que ataca al antígeno ', Ant], Mensaje).

explica(_, _, Mensaje) :-
    Mensaje = 'Sí: Compatibilidad total. Sin conflictos.'.

% ============================================
% INTERFAZ PARA PYTHON (FÁCIL DE PARSEAR)
% ============================================
% consulta_interface(Donante, Receptor, Estado, Mensaje)
consulta_interface(Donante, Receptor, 'COMPATIBLE', Mensaje) :-
    compatible_donante(Donante, Receptor),
    !,
    explica(Donante, Receptor, Mensaje).

consulta_interface(Donante, Receptor, 'INCOMPATIBLE', Mensaje) :-
    \+ compatible_donante(Donante, Receptor),
    explica(Donante, Receptor, Mensaje).