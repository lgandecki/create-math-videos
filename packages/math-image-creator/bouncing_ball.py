from manim import *
import numpy as np

class BouncingBall(Scene):
    def construct(self):
        # Create the ball
        ball = Circle(radius=0.3, color=BLUE, fill_opacity=1)
        ball.move_to(UP * 3 + LEFT * 3)
        
        # Create the ground
        ground = Line(LEFT * 4 + DOWN * 3, RIGHT * 4 + DOWN * 3, stroke_width=5)
        ground.set_color(GRAY)
        
        # Add ground to scene
        self.add(ground)
        
        # Physics parameters
        velocity_y = 0
        velocity_x = 2  # Horizontal velocity
        gravity = -9.8
        bounce_damping = 0.85
        friction = 0.98  # Horizontal friction
        
        # Track whether ball is still bouncing
        is_bouncing = True
        min_bounce_height = 0.1
        
        def update_ball(mob, dt):
            nonlocal velocity_y, velocity_x, is_bouncing
            
            if not is_bouncing:
                return
            
            # Update vertical velocity with gravity
            velocity_y += gravity * dt
            
            # Get current position
            current_pos = mob.get_center()
            new_x = current_pos[0] + velocity_x * dt
            new_y = current_pos[1] + velocity_y * dt
            
            # Check for ground collision
            if new_y - mob.radius <= ground.get_center()[1]:
                new_y = ground.get_center()[1] + mob.radius
                
                # Only bounce if velocity is significant
                if abs(velocity_y) > 0.5:
                    velocity_y = -velocity_y * bounce_damping
                    velocity_x *= friction  # Apply friction on bounce
                else:
                    velocity_y = 0
                    if abs(velocity_x) < 0.1:
                        is_bouncing = False
            
            # Check for wall collisions
            if new_x - mob.radius <= -3.7 or new_x + mob.radius >= 3.7:
                velocity_x = -velocity_x * 0.9
                new_x = np.clip(new_x, -3.7 + mob.radius, 3.7 - mob.radius)
            
            # Update position
            mob.move_to([new_x, new_y, 0])
        
        # Add updater to ball
        ball.add_updater(update_ball)
        
        # Create and animate the ball
        self.play(Create(ball))
        
        # Let the ball bounce
        self.wait(8)
        
        # Add a fade out at the end
        self.play(FadeOut(ball), FadeOut(ground))