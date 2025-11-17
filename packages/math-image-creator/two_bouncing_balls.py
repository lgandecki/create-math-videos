from manim import *
import numpy as np

class TwoBouncingBalls(Scene):
    def construct(self):
        # Physics parameters
        gravity = -9.8
        bounce_damping = 0.85
        friction = 0.98
        
        # Create ground line
        ground_y = -2.5
        ground = Line(LEFT * 4 + UP * ground_y, RIGHT * 4 + UP * ground_y, color=WHITE)
        self.add(ground)
        
        # Create two balls with different properties
        ball1 = Circle(radius=0.3, color=BLUE, fill_opacity=1)
        ball1.move_to(UP * 2 + LEFT * 2)
        ball1.velocity_x = 2.0
        ball1.velocity_y = 0.0
        
        ball2 = Circle(radius=0.25, color=RED, fill_opacity=1)
        ball2.move_to(UP * 2.5 + RIGHT * 1.5)
        ball2.velocity_x = -1.5
        ball2.velocity_y = -1.0
        
        # Add balls to scene
        self.add(ball1, ball2)
        
        # Create updater function for physics
        def update_ball(ball, dt):
            # Update velocity with gravity
            ball.velocity_y += gravity * dt
            
            # Apply friction to horizontal velocity
            ball.velocity_x *= friction
            
            # Calculate new position
            current_pos = ball.get_center()
            new_x = current_pos[0] + ball.velocity_x * dt
            new_y = current_pos[1] + ball.velocity_y * dt
            
            # Check ground collision
            if new_y - ball.radius <= ground_y:
                new_y = ground_y + ball.radius
                ball.velocity_y = -ball.velocity_y * bounce_damping
                
                # Stop tiny bounces
                if abs(ball.velocity_y) < 0.1:
                    ball.velocity_y = 0
            
            # Check wall collisions
            if new_x - ball.radius <= -3.7:
                new_x = -3.7 + ball.radius
                ball.velocity_x = -ball.velocity_x * 0.9
            elif new_x + ball.radius >= 3.7:
                new_x = 3.7 - ball.radius
                ball.velocity_x = -ball.velocity_x * 0.9
            
            # Update position
            ball.move_to(np.array([new_x, new_y, 0]))
        
        # Check collision between balls
        def check_ball_collision(dt):
            pos1 = ball1.get_center()
            pos2 = ball2.get_center()
            distance = np.linalg.norm(pos1 - pos2)
            min_distance = ball1.radius + ball2.radius
            
            if distance < min_distance:
                # Simple elastic collision
                # Calculate collision normal
                normal = (pos2 - pos1) / distance
                
                # Relative velocity
                rel_velocity = np.array([ball2.velocity_x - ball1.velocity_x, 
                                       ball2.velocity_y - ball1.velocity_y, 0])
                
                # Velocity along collision normal
                velocity_along_normal = np.dot(rel_velocity[:2], normal[:2])
                
                # Don't resolve if velocities are separating
                if velocity_along_normal > 0:
                    return
                
                # Calculate impulse scalar
                impulse = velocity_along_normal * 0.8  # Some energy loss
                
                # Apply impulse to velocities
                ball1.velocity_x += impulse * normal[0]
                ball1.velocity_y += impulse * normal[1]
                ball2.velocity_x -= impulse * normal[0]
                ball2.velocity_y -= impulse * normal[1]
                
                # Separate balls to prevent overlap
                overlap = min_distance - distance
                separate = normal * (overlap / 2 + 0.01)
                ball1.shift(-separate)
                ball2.shift(separate)
        
        # Add updaters
        ball1.add_updater(update_ball)
        ball2.add_updater(update_ball)
        self.add_updater(check_ball_collision)
        
        # Run animation
        self.wait(10)
        
        # Remove updaters before ending
        ball1.remove_updater(update_ball)
        ball2.remove_updater(update_ball)
        self.remove_updater(check_ball_collision)