/**
 * Middleware per controllo ruolo
 * accetta un ruolo richiesto (es: 'admin')
 */
function checkRole(requiredRole) {
    return (req, res, next) => {

        if (!req.user || !req.user.ruolo) {
            return res.status(403).json({
                message: 'Accesso negato'
            });
        }

        if (req.user.ruolo !== requiredRole) {
            return res.status(403).json({
                message: 'Permessi insufficienti'
            });
        }

        next();
    };
}

module.exports = checkRole;