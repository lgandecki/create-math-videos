from manim import *

class HelloWorldConclusion(Scene):
    def construct(self):
        # Display the final summary message
        line1 = Text("From 'Hello World' to complex applications,", font_size=36)
        line2 = Text("every programming journey begins with a single, simple step.", font_size=36)
        
        # Position the lines
        line1.to_edge(UP, buff=1.5)
        line2.next_to(line1, DOWN, buff=0.8)
        
        # Animate the summary message appearing
        self.play(Write(line1), run_time=2)
        self.wait(0.5)
        self.play(Write(line2), run_time=2.5)
        self.wait(2)
        
        # Fade out the summary message
        self.play(FadeOut(line1), FadeOut(line2), run_time=1.5)
        self.wait(0.5)
        
        # Show "Hello World!" one last time with glow effect
        hello_world = Text("Hello World!", font_size=72, color=BLUE)
        hello_world.move_to(ORIGIN)
        
        # Create a glow effect using multiple copies with increasing opacity and size
        glow_layers = []
        for i in range(5):
            glow = hello_world.copy()
            glow.set_color(BLUE)
            glow.set_opacity(0.1 - i * 0.015)
            glow.scale(1 + i * 0.05)
            glow_layers.append(glow)
        
        # Create the main text
        self.play(Write(hello_world), run_time=2)
        self.wait(0.5)
        
        # Add glow layers
        for glow in glow_layers:
            self.add(glow)
        
        # Animate expanding effect
        self.play(
            hello_world.animate.scale(1.2),
            *[glow.animate.scale(1.2) for glow in glow_layers],
            run_time=1.5
        )
        
        # Gentle pulsing effect
        for _ in range(2):
            self.play(
                hello_world.animate.scale(0.95),
                *[glow.animate.scale(0.95) for glow in glow_layers],
                run_time=0.8
            )
            self.play(
                hello_world.animate.scale(1.05),
                *[glow.animate.scale(1.05) for glow in glow_layers],
                run_time=0.8
            )
        
        # Hold the final frame
        self.wait(3)
        
        # Final fade out
        self.play(
            FadeOut(hello_world),
            *[FadeOut(glow) for glow in glow_layers],
            run_time=2
        )
        self.wait(1)