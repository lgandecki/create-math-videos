from manim import *
import numpy as np

class ThreeBouncingBalls(Scene):
    def construct(self):
        # Create ground line
        ground = Line(LEFT * 7, RIGHT * 7, color=WHITE).shift(DOWN * 3)
        self.add(ground)
        
        # Create three balls with different colors and starting positions
        ball1 = Circle(radius=0.3, color=RED, fill_opacity=1).shift(LEFT * 3 + UP * 2)
        ball2 = Circle(radius=0.4, color=BLUE, fill_opacity=1).shift(UP * 3)
        ball3 = Circle(radius=0.35, color=GREEN, fill_opacity=1).shift(RIGHT * 3 + UP * 1.5)
        
        # Add balls to scene
        self.add(ball1, ball2, ball3)
        
        # Physics parameters
        gravity = -9.8  # Gravity acceleration
        dt = 1/60  # Time step (60 fps)
        bounce_damping = 0.8  # Energy loss on bounce
        ground_y = -3  # Ground position
        
        # Initialize position and velocity trackers for each ball
        balls_data = [
            {
                "ball": ball1,
                "y_pos": ValueTracker(2),
                "velocity": ValueTracker(0),
                "radius": 0.3
            },
            {
                "ball": ball2,
                "y_pos": ValueTracker(3),
                "velocity": ValueTracker(-2),
                "radius": 0.4
            },
            {
                "ball": ball3,
                "y_pos": ValueTracker(1.5),
                "velocity": ValueTracker(1),
                "radius": 0.35
            }
        ]
        
        # Add updaters to each ball
        for data in balls_data:
            ball = data["ball"]
            y_tracker = data["y_pos"]
            vel_tracker = data["velocity"]
            radius = data["radius"]
            
            # Position updater
            def make_position_updater(y_t, b):
                def update_position(mob):
                    mob.move_to([mob.get_center()[0], y_t.get_value(), 0])
                return update_position
            
            ball.add_updater(make_position_updater(y_tracker, ball))
        
        # Physics simulation function
        def update_physics(mob, dt):
            for data in balls_data:
                y_tracker = data["y_pos"]
                vel_tracker = data["velocity"]
                radius = data["radius"]
                
                # Update velocity (apply gravity)
                new_velocity = vel_tracker.get_value() + gravity * dt
                vel_tracker.set_value(new_velocity)
                
                # Update position
                new_y = y_tracker.get_value() + new_velocity * dt
                
                # Check for ground collision
                if new_y - radius <= ground_y:
                    new_y = ground_y + radius
                    # Reverse and dampen velocity
                    vel_tracker.set_value(-new_velocity * bounce_damping)
                
                y_tracker.set_value(new_y)
        
        # Add physics updater to the scene
        dummy_mob = Mobject()
        dummy_mob.add_updater(update_physics)
        self.add(dummy_mob)
        
        # Add title
        title = Text("Three Bouncing Balls", font_size=36).to_edge(UP)
        self.play(Write(title))
        
        # Run the animation for 8 seconds
        self.wait(8)
        
        # Remove updaters before ending
        for data in balls_data:
            data["ball"].clear_updaters()
        dummy_mob.clear_updaters()
        
        # Final bounce effect
        self.play(
            ball1.animate.scale(1.5).set_color(YELLOW),
            ball2.animate.scale(1.5).set_color(PURPLE),
            ball3.animate.scale(1.5).set_color(ORANGE),
            run_time=0.5
        )
        self.play(
            ball1.animate.scale(1/1.5).set_color(RED),
            ball2.animate.scale(1/1.5).set_color(BLUE),
            ball3.animate.scale(1/1.5).set_color(GREEN),
            run_time=0.5
        )
        
        self.wait(1)