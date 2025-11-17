from manim import *
import numpy as np

class SineCosinIntro(Scene):
    def construct(self):
        # Display the title
        title = Text("Sine vs. Cosine Waves", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create unit circle with axes
        axes = Axes(
            x_range=[-1.5, 1.5, 0.5],
            y_range=[-1.5, 1.5, 0.5],
            x_length=6,
            y_length=6,
            axis_config={"color": WHITE}
        )
        
        # Create unit circle
        unit_circle = Circle(radius=2, color=YELLOW)
        
        # Position axes and circle at center
        circle_group = VGroup(axes, unit_circle)
        circle_group.move_to(ORIGIN)
        
        self.play(Create(axes))
        self.play(Create(unit_circle))
        self.wait(1)
        
        # Add text about two fundamental waves
        text1 = Text("Two fundamental waves, one origin.", font_size=36, color=WHITE)
        text1.next_to(title, DOWN, buff=0.5)
        self.play(Write(text1))
        self.wait(1)
        
        # Create rotating arrow representing angle theta
        # Start from positive x-axis
        arrow_start = axes.coords_to_point(0, 0)
        arrow_end = axes.coords_to_point(2, 0)  # radius of 2 to match circle
        
        arrow = Arrow(arrow_start, arrow_end, color=RED, buff=0)
        
        # Create theta label
        theta_label = MathTex(r"\theta", color=RED, font_size=36)
        theta_label.next_to(arrow_end, RIGHT, buff=0.2)
        
        self.play(Create(arrow))
        self.play(Write(theta_label))
        self.wait(1)
        
        # Animate arrow rotating counter-clockwise
        def update_arrow_and_label(mob, dt):
            # Get current angle and increment
            current_angle = getattr(mob, 'angle', 0)
            new_angle = current_angle + dt * 0.5  # Rotate at 0.5 rad/s
            
            # Calculate new end point
            new_end = axes.coords_to_point(
                2 * np.cos(new_angle), 
                2 * np.sin(new_angle)
            )
            
            # Update arrow
            mob.put_start_and_end_on(arrow_start, new_end)
            mob.angle = new_angle
            
            # Update theta label position
            theta_label.next_to(new_end, 
                               RIGHT if np.cos(new_angle) > 0 else LEFT, 
                               buff=0.2)
        
        arrow.add_updater(update_arrow_and_label)
        
        # Animate for one full rotation
        self.wait(4 * PI / 0.5)  # Time for one full rotation at 0.5 rad/s
        
        arrow.remove_updater(update_arrow_and_label)
        self.wait(1)