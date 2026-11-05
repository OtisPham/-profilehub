import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ success: false, message: 'Unauthorized: Invalid session' });
      return;
    }

    let role = (user.user_metadata?.role as string) || (user.app_metadata?.role as string);
    if (!role) {
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        role = profile?.role;
      } catch {
        // Fallback to student
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: role || 'student',
    };

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error in Auth Middleware', error });
  }
}

/**
 * Role-Based Access Control (RBAC) Middleware
 * Yêu cầu người dùng phải sở hữu một trong các vai trò được cấp phép.
 * Trả về 401 nếu chưa đăng nhập, 403 Forbidden nếu vai trò không hợp lệ.
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
      return;
    }

    const userRole = req.user.role || 'student';
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access denied. Required role(s): [${allowedRoles.join(', ')}], your role: '${userRole}'`,
      });
      return;
    }

    next();
  };
}

/**
 * Optional Auth: Xác thực nếu có token, nếu không có token thì vẫn tiếp tục với vai trò guest
 */
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const role = (user.user_metadata?.role as string) || (user.app_metadata?.role as string) || 'student';
        req.user = {
          id: user.id,
          email: user.email,
          role,
        };
      }
    }
  } catch {
    // Không ném lỗi, tiếp tục với vai trò guest
  }
  next();
}
